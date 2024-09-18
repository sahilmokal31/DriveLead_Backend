const CatchAsynError = require('../middleware/CatchAsynError');
const { response } = require('../service/Response');

exports.search = CatchAsynError(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return response(res, 'Prompt is required!', {}, 400);
    }

    // Mock search response for now. This can be replaced with AI/ML logic in the future.
    const mockResults = [
      { id: 1, result: `Result for prompt "${prompt}"` },
      { id: 2, result: `Another result related to "${prompt}"` },
    ];

    return response(res, 'Search results fetched successfully!', { results: mockResults }, 200);
  } catch (error) {
    return response(res, error.message, {}, 500);
  }
});
