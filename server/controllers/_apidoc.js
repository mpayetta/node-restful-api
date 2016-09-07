// ------------------------------------------------------------------------------------------
// Headers
// ------------------------------------------------------------------------------------------

/**
 * @apiDefine AuthorizationHeader
 *
 * @apiHeader {Object} Authorization must follow the JWT authorization header
 * definition using the `Bearer` prefix.
 *
 * @apiHeaderExample {json} Authorization Header Example:
 *    {
 *      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ..."
 *    }
 *
 */

// ------------------------------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------------------------------

/**
 * @apiDefine NotAuthorizedError
 *
 * @apiError NotAuthorized The JWT is missing or not valid.
 *
 * @apiErrorExample NotAuthorized Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     }
 */

/**
 * @apiDefine InternalServerError
 *
 * @apiError InternalError There was an internal error when trying to serve the request
 *
 * @apiErrorExample InternalError Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "InternalServerError"
 *     }
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample UserNotFound Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */


// ------------------------------------------------------------------------------------------
// Success
// ------------------------------------------------------------------------------------------

/**
 * @apiDefine ResultSuccessResponse
 * @apiDescription Simple success response
 *
 * @apiSuccess {String} result Always equal to `success` when request is successful
 *
 * @apiSuccessExample ResultSuccess Response:
 *    HTTP/1.1 200 Success
 *    {
 *      "result": "success"
 *    }
 */

// ------------------------------------------------------------------------------------------
// Pagination
// ------------------------------------------------------------------------------------------

/**
 * @apiDefine PaginationResponse
 *
 * @apiSuccess {Object} pagination Contains pagination data
 * @apiSuccess {String} pagination.totalRecords Total number of records for query
 * @apiSuccess {String} pagination.currentPage Page that was returned in the current query
 *
 */
