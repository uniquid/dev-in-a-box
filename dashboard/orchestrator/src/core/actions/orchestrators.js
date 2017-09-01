export const GET_ALL_ORCHESTRATORS = 'GET_ALL_ORCHESTRATORS'

export const getAllOrchestratorsAction = (orchestrators) => {
  return {
    type: 'GET_ALL_ORCHESTRATORS',
    orchestrators
  }
}