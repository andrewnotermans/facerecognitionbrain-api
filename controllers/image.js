import fetch from "node-fetch"; // Import fetch for server-side calls

export const handleApiCall = (req, res) => {
  const MODEL_ID = "face-detection";
  const PAT = "60df1f2fc09b470da2117dde445f6abf";
  const USER_ID = "af8w21gvcx87";
  const APP_ID = "image-recognition";

  const { input } = req.body; // Receive the image URL from the client

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: input,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  fetch(
    `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch from Clarifai API");
      }
      return response.json();
    })
    .then((data) => res.json(data)) // Send the Clarifai response to the front-end
    .catch((err) => res.status(400).json("Unable to work with API"));
};

export const handleImage = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};
