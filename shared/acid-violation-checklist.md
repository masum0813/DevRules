# ACID Violation Checklist (DB Writes)

Use this checklist during implementation and code review. If **any** item is true, the change likely violates
the “DB write => transactional/ACID boundary mandatory” rule.

## Transaction boundaries
- [ ] Multi-step DB write flow exists, but there is **no explicit transaction**.
- [ ] Transaction is opened in the **controller/router/UI layer** instead of the service layer.
- [ ] A transaction spans network calls / long-running operations unnecessarily (risking locks/timeouts).
- [ ] Commit/rollback responsibility is unclear or scattered.

## Atomicity / partial writes
- [ ] A failure can leave the system in a **partially updated** state.
- [ ] Write operations are split across multiple services without an orchestrated transaction strategy.
- [ ] Compensating actions are required but not implemented/documented.

## Consistency
- [ ] DB constraints (PK/FK/unique/check) are missing for critical invariants.
- [ ] Application validation contradicts DB constraints.
- [ ] Domain invariants are not enforced at boundaries (service layer).

## Isolation / concurrency
- [ ] Race conditions can occur (read-modify-write) without appropriate isolation or locking strategy.
- [ ] Isolation level assumptions are undefined or inconsistent.
- [ ] Retries can cause double-writes due to missing idempotency controls.

## Durability / reliability
- [ ] Success is reported before commit is guaranteed.
- [ ] Errors are swallowed; failures are not observable (no logging/metrics).

## Idempotency (highly recommended for retryable flows)
- [ ] Operation can be retried but is not idempotent (no idempotency key / unique constraint / upsert strategy).
- [ ] Side effects (events, external calls) can happen twice without safeguards.

## “Green path” expectations
When DB writes exist:
- Keep transaction boundary in the **service layer**.
- Ensure “all-or-nothing” behavior (commit/rollback).
- Document idempotency and edge cases in **public API doc comments**.
