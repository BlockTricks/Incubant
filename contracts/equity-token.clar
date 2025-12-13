;; Equity Token Contract
;; Manages equity tokenization, vesting schedules, and transfers

(define-constant ERR-UNAUTHORIZED (err u3001))
(define-constant ERR-INSUFFICIENT-BALANCE (err u3002))
(define-constant ERR-VESTING-ACTIVE (err u3003))
(define-constant ERR-INVALID-AMOUNT (err u3004))
(define-constant ERR-STARTUP-NOT-FOUND (err u3005))
(define-constant ERR-CONTRACT-PAUSED (err u3006))
(define-constant ERR-TRANSFER-RESTRICTED (err u3007))
(define-constant ERR-NOT-OWNER (err u3008))
(define-constant ERR-ALREADY-EXISTS (err u3009))

(define-data-var contract-owner principal tx-sender)
(define-data-var contract-paused bool false)

;; Token balances
(define-map balances
    { owner: principal }
    uint
)

;; Vesting schedules
(define-map vesting-schedules
    { recipient: principal, startup-id: uint }
    {
        total-amount: uint,
        vested-amount: uint,
        start-time: uint,
        cliff-duration: uint,
        vesting-duration: uint,
        release-interval: uint,
        last-release: uint
    }
)

;; Startup equity allocations
(define-map startup-equity
    { startup-id: uint }
    {
        total-supply: uint,
        reserved-amount: uint,
        distributed-amount: uint,
        token-uri: (optional (string-ascii 256))
    }
)

;; Modifier functions
(define-private (only-owner)
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)
)

(define-private (when-not-paused)
    (asserts! (not (var-get contract-paused)) ERR-CONTRACT-PAUSED)
)

;; Initialize equity for a startup
(define-public (initialize-equity
    (startup-id uint)
    (total-supply uint)
    (reserved-amount uint)
    (token-uri (optional (string-ascii 256)))
)
    (begin
        (only-owner)
        (when-not-paused)
        (let
            (
                (timestamp (unwrap-panic (get-block-info? time u0)))
                (existing (map-get? startup-equity { startup-id: startup-id }))
            )
            (asserts! (is-none existing) ERR-ALREADY-EXISTS)
            (asserts! (>= total-supply reserved-amount) ERR-INVALID-AMOUNT)
            (ok (map-set startup-equity
                { startup-id: startup-id }
                {
                    total-supply: total-supply,
                    reserved-amount: reserved-amount,
                    distributed-amount: u0,
                    token-uri: token-uri
                }
            ))
        )
    )
)

;; Update startup token URI
(define-public (update-token-uri
    (startup-id uint)
    (token-uri (optional (string-ascii 256)))
)
    (begin
        (only-owner)
        (when-not-paused)
        (let
            (
                (equity (unwrap! (map-get? startup-equity { startup-id: startup-id }) ERR-STARTUP-NOT-FOUND))
            )
            (ok (map-set startup-equity
                { startup-id: startup-id }
                {
                    total-supply: (get total-supply equity),
                    reserved-amount: (get reserved-amount equity),
                    distributed-amount: (get distributed-amount equity),
                    token-uri: token-uri
                }
            ))
        )
    )
)

;; Mint equity tokens to a recipient
(define-public (mint-equity
    (recipient principal)
    (startup-id uint)
    (amount uint)
)
    (begin
        (only-owner)
        (when-not-paused)
        (let
            (
                (equity (unwrap! (map-get? startup-equity { startup-id: startup-id }) ERR-STARTUP-NOT-FOUND))
                (current-balance (default-to u0 (map-get? balances { owner: recipient })))
                (new-distributed (+ (get distributed-amount equity) amount))
            )
            (asserts! (<= new-distributed (get total-supply equity)) ERR-INVALID-AMOUNT)
            (asserts! (<= new-distributed (- (get total-supply equity) (get reserved-amount equity))) ERR-INVALID-AMOUNT)
            (begin
                (map-set balances { owner: recipient } (+ current-balance amount))
                (map-set startup-equity
                    { startup-id: startup-id }
                    {
                        total-supply: (get total-supply equity),
                        reserved-amount: (get reserved-amount equity),
                        distributed-amount: new-distributed,
                        token-uri: (get token-uri equity)
                    }
                )
                (ok true)
            )
        )
    )
)

;; Create vesting schedule
(define-public (create-vesting-schedule
    (recipient principal)
    (startup-id uint)
    (total-amount uint)
    (cliff-duration uint)
    (vesting-duration uint)
    (release-interval uint)
)
    (begin
        (only-owner)
        (when-not-paused)
        (let
            (
                (timestamp (unwrap-panic (get-block-info? time u0)))
                (existing (map-get? vesting-schedules { recipient: recipient, startup-id: startup-id }))
                (recipient-balance (default-to u0 (map-get? balances { owner: recipient })))
            )
            (asserts! (is-none existing) ERR-VESTING-ACTIVE)
            (asserts! (>= recipient-balance total-amount) ERR-INSUFFICIENT-BALANCE)
            (ok (map-set vesting-schedules
                { recipient: recipient, startup-id: startup-id }
                {
                    total-amount: total-amount,
                    vested-amount: u0,
                    start-time: timestamp,
                    cliff-duration: cliff-duration,
                    vesting-duration: vesting-duration,
                    release-interval: release-interval,
                    last-release: timestamp
                }
            ))
        )
    )
)

;; Calculate vested amount at a given time
(define-read-only (calculate-vested-amount
    (schedule { total-amount: uint, vested-amount: uint, start-time: uint, cliff-duration: uint, vesting-duration: uint, release-interval: uint, last-release: uint })
    (current-time uint)
)
    (let
        (
            (start-time (get start-time schedule))
            (cliff-end (+ start-time (get cliff-duration schedule)))
            (vesting-end (+ start-time (get vesting-duration schedule)))
        )
        (if
            (< current-time cliff-end)
            u0
            (if
                (>= current-time vesting-end)
                (get total-amount schedule)
                (let
                    (
                        (time-elapsed (- current-time start-time))
                    )
                    (/ (* (get total-amount schedule) time-elapsed) (get vesting-duration schedule))
                )
            )
        )
    )
)

;; Release vested tokens
(define-public (release-vested-tokens
    (recipient principal)
    (startup-id uint)
)
    (begin
        (when-not-paused)
        (let
            (
                (schedule (unwrap! (map-get? vesting-schedules { recipient: recipient, startup-id: startup-id }) ERR-VESTING-ACTIVE))
                (current-time (unwrap-panic (get-block-info? time u0)))
                (vested-amount (calculate-vested-amount schedule current-time))
                (previously-vested (get vested-amount schedule))
            )
            (if
                (> vested-amount previously-vested)
                (let
                    (
                        (newly-vested (- vested-amount previously-vested))
                    )
                    (begin
                        (map-set vesting-schedules
                            { recipient: recipient, startup-id: startup-id }
                            {
                                total-amount: (get total-amount schedule),
                                vested-amount: vested-amount,
                                start-time: (get start-time schedule),
                                cliff-duration: (get cliff-duration schedule),
                                vesting-duration: (get vesting-duration schedule),
                                release-interval: (get release-interval schedule),
                                last-release: current-time
                            }
                        )
                        (ok newly-vested)
                    )
                )
                (ok u0)
            )
        )
    )
)

;; Transfer equity tokens with vesting check
(define-public (transfer-equity
    (recipient principal)
    (amount uint)
)
    (begin
        (when-not-paused)
        (let
            (
                (sender tx-sender)
                (sender-balance (unwrap! (map-get? balances { owner: sender }) ERR-INSUFFICIENT-BALANCE))
                (recipient-balance (default-to u0 (map-get? balances { owner: recipient })))
                (available-balance (calculate-available-balance sender))
            )
            (asserts! (>= available-balance amount) ERR-INSUFFICIENT-BALANCE)
            (asserts! (>= sender-balance amount) ERR-INSUFFICIENT-BALANCE)
            (begin
                (map-set balances { owner: sender } (- sender-balance amount))
                (map-set balances { owner: recipient } (+ recipient-balance amount))
                (ok true)
            )
        )
    )
)

;; Calculate available balance (total balance minus locked in vesting)
(define-read-only (calculate-available-balance (owner principal))
    (let
        (
            (total-balance (default-to u0 (map-get? balances { owner: owner })))
            (locked-amount (fold vesting-schedules
                (entry { recipient: recipient, startup-id: startup-id } value)
                u0
                (if (is-eq recipient owner)
                    (let
                        (
                            (schedule value)
                            (current-time (unwrap-panic (get-block-info? time u0)))
                            (vested (get vested-amount schedule))
                            (total (get total-amount schedule))
                        )
                        (+ locked-amount (- total vested))
                    )
                    locked-amount
                )
            ))
        )
        (if (> total-balance locked-amount)
            (- total-balance locked-amount)
            u0
        )
    )
)

;; Burn tokens (only contract owner)
(define-public (burn-tokens
    (owner principal)
    (amount uint)
)
    (begin
        (only-owner)
        (when-not-paused)
        (let
            (
                (balance (unwrap! (map-get? balances { owner: owner }) ERR-INSUFFICIENT-BALANCE))
            )
            (asserts! (>= balance amount) ERR-INSUFFICIENT-BALANCE)
            (begin
                (map-set balances { owner: owner } (- balance amount))
                (ok true)
            )
        )
    )
)

;; Transfer contract ownership
(define-public (transfer-ownership (new-owner principal))
    (begin
        (only-owner)
        (var-set contract-owner new-owner)
        (ok true)
    )
)

;; Pause/Unpause contract
(define-public (set-paused (paused bool))
    (begin
        (only-owner)
        (var-set contract-paused paused)
        (ok true)
    )
)

;; Get balance
(define-read-only (get-balance (owner principal))
    (default-to u0 (map-get? balances { owner: owner }))
)

;; Get available balance
(define-read-only (get-available-balance (owner principal))
    (calculate-available-balance owner)
)

;; Get vesting schedule
(define-read-only (get-vesting-schedule (recipient principal) (startup-id uint))
    (map-get? vesting-schedules { recipient: recipient, startup-id: startup-id })
)

;; Get startup equity info
(define-read-only (get-startup-equity (startup-id uint))
    (map-get? startup-equity { startup-id: startup-id })
)

;; Get contract owner
(define-read-only (get-contract-owner)
    (var-get contract-owner)
)

;; Get contract paused status
(define-read-only (is-contract-paused)
    (var-get contract-paused)
)

;; Get total supply for startup
(define-read-only (get-total-supply (startup-id uint))
    (match (map-get? startup-equity { startup-id: startup-id }) 
        equity (some (get total-supply equity))
        none
    )
)

;; Get remaining mintable tokens for startup
(define-read-only (get-remaining-mintable (startup-id uint))
    (match (map-get? startup-equity { startup-id: startup-id }) 
        equity (let
            (
                (total (get total-supply equity))
                (distributed (get distributed-amount equity))
                (reserved (get reserved-amount equity))
            )
            (some (- total (+ distributed reserved)))
        )
        none
    )
)
