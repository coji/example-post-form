import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.query.response) {
    response.status(200).send(request.query.response)
  } else {
    response.status(200).json({
      body: request.body,
      query: request.query,
    })
  }
}
