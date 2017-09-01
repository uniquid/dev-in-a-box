export const ADD_PROVIDER = 'ADD_PROVIDER'
export const ADD_USER = 'ADD_USER'

export const addProviderAction = (provider) => {
  return {
    type: 'ADD_PROVIDER',
    provider
  }
}

export const addUserAction = (user) => {
  return {
    type: 'ADD_USER',
    user
  }
}
