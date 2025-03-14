import { check, sleep } from 'k6'
import http from 'k6/http'

export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '30s', target: 200 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
}

export default function () {
  const res = http.post(
    'http://nginx/api/v1/order',
    JSON.stringify({
      resaleId: 'uuid-resale',
      items: [
        { productId: 'beer-001', quantity: 10 },
        { productId: 'beer-002', quantity: 20 },
      ],
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )

  check(res, {
    'status was 201': (r) => r.status === 201,
    'request duration < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)
}
