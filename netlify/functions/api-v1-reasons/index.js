const fetch = require("node-fetch");
const { API_AIRTABLE_KEY } = process.env;
const API_ENDPOINT = `https://api.airtable.com/v0/app6AdLXGbubsrirh/Conditions?api_key=${API_AIRTABLE_KEY}`;

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  let url = API_ENDPOINT;
  if (id) {
    url = `${API_ENDPOINT}&filterByFormula=Find(%22${id}%22,${field})`;
  }
  const results = [];

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.records.length < 1) {
      throw new Error(`No accounts`);
    }
    data.records.map((item) => {
      const fields = item.fields;
      let result = {
        id: fields.id,
        name: fields.name,
        users: [],
      };
      if (fields.users) {
        fields.users.map((item, index) => {
          const user = {
            hstreamid: fields["hstreamid (from users)"][index],
            given_name: fields["given_name (from users)"][index],
            family_name: fields["family_name (from users)"][index],
            email: fields["email (from users)"][index],
          };
          result.users.push(user);
        });
      }
      if (!id) {
        result.users = result.users.length;
      }
      if (!id || (id && id === result[field])) {
        results.push(result);
      }
    });


  } catch (err) {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }

  return {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
