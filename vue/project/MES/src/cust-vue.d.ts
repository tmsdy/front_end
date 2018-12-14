import Vue from 'vue'
import axios from 'axios'
import store from 'store'
import User from '@/utils/user'

declare module 'vue/types/vue' {
  interface Vue {
    $http: typeof axios
    $cache: typeof store
    $session: typeof store
    $goto(path: string): undefined
    $user: typeof User
  }
  interface VueConstructor {
    validate: Function
  }
}
