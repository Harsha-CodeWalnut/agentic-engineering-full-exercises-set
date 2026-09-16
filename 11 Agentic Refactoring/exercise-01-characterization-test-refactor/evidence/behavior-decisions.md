# Renewal Behavior Decisions

The twelve protected observations describe existing public behavior, not preferred product policy. This exercise authorizes structural refactoring only. Every result is therefore classified as **preserve**, while questionable policy remains a **suspected bug** for a separately approved change.

| Observation | Decision | Reason |
| --- | --- | --- |
| Enterprise becomes eligible at exactly 12 months with one late payment. | Preserve | The tenure boundary and discount are public behavior. |
| Enterprise with exactly two late payments receives `manual-review` and `payment-history`. | Preserve | The threshold and exact reason string are observable. |
| Enterprise above the boundary remains eligible. | Preserve | The rule applies to mature accounts, not only the boundary case. |
| Enterprise below 12 months receives `plan-not-supported`. | Preserve | The legacy default is part of the current contract. |
| A negative late-payment count qualifies for the enterprise discount. | Preserve; suspected bug | Missing validation is not authorized for change here. |
| Pro becomes eligible at exactly six months with no late payments. | Preserve | The boundary, discount, and `pro-tenure` reason are protected. |
| Pro above the boundary remains eligible when clean. | Preserve | Eligibility must continue beyond the boundary. |
| Pro below six months receives `plan-not-supported`. | Preserve | The fallback output is observable. |
| Mature pro with one late payment receives `plan-not-supported`. | Preserve; suspected bug | A payment-history result may be clearer, but that is a policy change. |
| Support override makes a new starter eligible with zero discount. | Preserve; suspected bug | Override bypasses tier, tenure, and arrears checks. |
| Support override wins over enterprise arrears. | Preserve; suspected bug | Support override precedence must remain first. |
| An ordinary starter remains unsupported after 18 months. | Preserve | Unsupported tiers retain the exact default result. |

The refactor preserves the exported function, plain-record inputs, returned fields, exact status and reason strings, discount values, validation gaps, and decision order. Getter, proxy, and property-read side effects remain outside the exercise contract, as specified by the current README.
