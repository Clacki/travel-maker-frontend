# Mock data architecture

## Runtime data flow

The application selects one data source at the shared Axios layer.

```text
UI / Server Component
  -> feature API function
  -> shared Axios client
     -> mock: in-process mock adapter -> mock repository -> fixture
     -> api:  HTTP adapter -> real backend
```

`mock` is the default when no backend URL is configured. It performs no DNS or
HTTP request and works the same way in browser and server runtimes. `api` is
selected with `NEXT_PUBLIC_DATA_SOURCE=api` and requires
`NEXT_PUBLIC_API_URL`.

## MSW scope

MSW is optional and limited to development/test network simulation. Set
`NEXT_PUBLIC_MSW_ENABLED=true` in a non-production build to start the browser
worker. Production never starts Browser MSW or Node MSW, and no Server
Component depends on request interception.

The handler inventory is:

| Handler     | API area                                      | Main consumers                       | Fixture                                 |
| ----------- | --------------------------------------------- | ------------------------------------ | --------------------------------------- |
| `auth`      | demo login, current/public user               | auth initializer, profile            | `mocks/db.ts`, `mocks/data/demoData.ts` |
| `places`    | list, search, filter, recommend, detail, tags | explore, detail, course place search | `placeMockRepository`, `demoData.ts`    |
| `bookmarks` | list, add, delete                             | explore, detail, my page             | `mocks/db.ts`                           |
| `reviews`   | place review list                             | detail                               | `mocks/db.ts`                           |
| `profile`   | user reviews/routes/quiz result               | my page                              | `profileData.ts`, `quizData.ts`         |
| `quiz`      | submit/shared result                          | test result                          | `quizData.ts`                           |
| `routes`    | course list/detail                            | trips, trip editor                   | `routeData.ts`                          |

Handlers and the direct adapter consume the same fixture modules. Place query
and detail behavior is shared through `placeMockRepository`.

## Changing to a real API

Set the following build-time variables and redeploy:

```dotenv
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_MSW_ENABLED=false
```

Feature components and API function signatures do not change. Any new mock
endpoint should be added to the direct adapter first; an MSW handler is needed
only when network-level simulation is useful for development or tests.
