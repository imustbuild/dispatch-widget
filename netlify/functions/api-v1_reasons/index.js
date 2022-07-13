// import fetch from "node-fetch";
const { API_AIRTABLE_KEY } = process.env;
const API_ENDPOINT = `https://api.airtable.com/v0/app6AdLXGbubsrirh/Conditions?api_key=${API_AIRTABLE_KEY}`;

exports.handler = async (event, context) => {
  const url = API_ENDPOINT;
  const results = [];

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.records.length < 1) {
      throw new Error(`No reasons`);
    }
    data.records.map((item) => {
      const fields = item.fields;
      let result = {
        id: fields.Id,
        label: fields.Condition,
        primary: fields["Primary Topic"],
      };
      results.push(result);
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
