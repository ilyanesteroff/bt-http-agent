const axios = require('axios')


const NODE = 'http://localhost:8080'
const PYTHON = 'http://127.0.0.1:5000'


const SERVERS = [
  { id: 'js', host: NODE },
  { id: 'py', host: PYTHON },
]


const networking = '/networking'
const crypto = '/crypto'
const fs = '/fs'


const ENDPOINTS = [
  { id: 'net', value: networking },
  { id: 'cr', value: crypto },
  { id: 'fs', value: fs },
]


const makeReq = async (url) => {
  const res = await axios.post(url, { validateStatus: () => true })

  return res.data
}


const run = async () => {
  const lang = SERVERS.find((s) => s.id === process.argv[2])
  const endpoint = ENDPOINTS.find((e) => e.id === process.argv[3])

  if (endpoint && lang) {
    const start = new Date().getTime()

    await makeReq(`${lang.host}/measure/start`)

    await Promise.all(
      (() => {
        const output = []

        const url = `${lang.host}${endpoint.value}`

        console.log(url)

        for (var i = 1; i <= 250; i++) {
          output.push(makeReq(url))
        }

        return output
      })()
    )

    const res = await makeReq(`${lang.host}/measure/stop`)

    const end = new Date().getTime()

    console.log(`Stats: Total time - ${end - start} ms, CPU time - ${res.cpu / 1000} ms, *Memory - ${res.mem} Mb`)
  }
}


run()