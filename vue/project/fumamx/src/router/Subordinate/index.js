/**
 * 下属
 */
export default {
  path: 'subordinate/:moduleCode?',
  name: 'Subordinate',
  component: () => import ('@/page/Main/Subordinate/index')
}
