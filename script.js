'use strict';

const apiKey = "qQpus7Ly0g5eccyEg7CBWuiLp5JWTOVttlFEh5pK"

const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

function getParks(stateCode, limit=10) {
 
  const params = {
    api_key: apiKey,
    stateCode,
    limit
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;


  return fetch(url)
  .then(response => {
     console.log(response.ok)
    if (response.ok) {
      return response.json();
    }
    response.json()
    .then (responseJson => {
      throw new Error(responseJson)
    })
  })
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $("#parkslist").html("<li>searching</li>")
    $("#js-error-message").text("")
    const stateCode = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(stateCode, maxResults).then(responseJson => displayParks(responseJson.data)).catch(error => {
      $('#js-error-message').text(`Sorry, something went wrong: ${error.message}`);
    })
  })
}
$(watchForm);


function displayParks(parks) {
  if (parks.length > 0) { 
 
$("#parkslist").html(parks.map(park => {
 
  const address = park.addresses[0]
  console.log(address)
  return `
<li>
<h2> ${park.fullName}</h2> 
<a href="${park.url}">${park.url}</a>
<p> ${park.description} </p>
${address?`<address> ${address.line1} ${address.city}, ${address.stateCode} ${address.postalCode} </address>`:""}



</li>

`}).join("\n"))
} else {
$("#parkslist").html("<li>No results</li>")
}

$("#results").removeClass("hidden");
}
