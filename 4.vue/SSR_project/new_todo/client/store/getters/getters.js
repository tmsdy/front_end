export default { //像个全局的computed
  fullName(state){
    return state.firstName +' '+state.lastName
  }
}
