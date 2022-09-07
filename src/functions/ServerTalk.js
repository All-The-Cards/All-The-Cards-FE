// This file contains utilities to communicate between the front-end and back-end

// Production server link
const production = { 
    api_url: 'https://allthecards-api.herokuapp.com',
    redirect_url: 'https://allthecards.herokuapp.com' 
}
const development = { 
    api_url: 'http://localhost:5000', 
    redirect_url: 'http://localhost:3000' 
}
const config = process.env.NODE_ENV === 'development' ? development : production;


// Run HTTP GET from the target location
// Parameters:
//     query (string) - "/dir/page"
// Returns: Promise, expected to be handled
// Usage: Example including class state and local members
//
//     let localMember = ""
//     const [stateMember, setStateMember] = useState("")
//     server.post(query)
//       .then(response => {
//         localMember = response.data
//         setStateMember(response.data)
//         return response
//     }).then(response => console.log(response, localMember, stateMember))
//
export function get(query){
    let url = buildAPIUrl(query)

    const data = { 
        method: 'GET'
    }

    return fetch(url, data)
        .then(response => {
            return response.json()
        })
        .then((result) => {
            //console.log(result)
            return result
        })
        .catch((error) => {
            //console.log(error)
            return error
        })

}

// Send HTTP POST request to the server
// Parameters:
//     query (string) - "/dir/page"
// Returns: Promise, expected to be handled
// Usage: Example including class state and local members
//
//     let localMember = ""
//     const [stateMember, setStateMember] = useState("")
//     server.post(query)
//       .then(response => {
//         localMember = response.data
//         setStateMember(response.data)
//         return response
//     }).then(response => console.log(response, localMember, stateMember))
//
export function post(query){
    let url = buildAPIUrl(query)

    const data = { 
        method: 'POST'
    }

    return fetch(url, data)
        .then(response => {
            return response.json()
        })
        .then((result) => {
            //console.log(result)
            return result
        })
        .catch((error) => {
            //console.log(error)
            return error
        })

}

// Gets the base url for HTTP requests, appends an optional query if in valid format
// Parameters:
//     query (string) - "/dir/page"
// Returns: string - "http://www.address.com/dir/page"
//
export function buildAPIUrl(query){
    //get base url for query from environment
    let url = config.api_url

    //validate query as existing and in correct format, then append to url
    if (query && query[0] === '/') url += query

    return url
}

// Gets the base url for redirects, appends an optional query if in valid format
// Parameters:
//     query (string) - "/dir/page"
// Returns: string - "http://www.address.com/dir/page"
//
export function buildRedirectUrl(query){
    //get base url for query from environment
    let url = config.redirect_url

    //validate query as existing and in correct format, then append to url
    if (query && query[0] === '/') url += query

    return url
}