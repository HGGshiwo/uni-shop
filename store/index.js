// 页面路径：store/index.js
import {createStore} from 'vuex'
import cart from '@/store/cart.js'
import user from '@/store/user.js'

export default createStore({
	modules: {
		cart,
		user
	}
})