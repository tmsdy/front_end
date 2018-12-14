import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Sidebar from '@/components/Sidebar/index.vue'

describe('components/Sidebar/index.vue', () => {
  it('Show currect number of menu item', () => {
    const menus = [
      { label: '生产效率', to: { name: '生产效率' } },
      { label: '机器管理', to: { name: '机器管理' } },
    ]
    const wrapper = shallowMount(Sidebar, {
      propsData: { menus },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    })

    expect(wrapper.findAll('.sidebar-menu li').length).toEqual(menus.length)
  })
})
