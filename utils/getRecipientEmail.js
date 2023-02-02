const getRecipientEmail = (users, sessionUser) =>
  users?.filter((userToFilter) => userToFilter !== sessionUser?.email)[0]

export default getRecipientEmail
