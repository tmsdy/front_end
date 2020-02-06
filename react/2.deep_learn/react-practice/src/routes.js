import React from 'react'
import { Route } from 'react-router-dom'

import RefDeom from './learn/1.ref'
import ContextDemo from './learn/3.context'
import ConcurrentModeDemo from './learn/4.concurrent-mode'
import SuspenseDemo from './learn/5.suspense'
import HooksDemo from './learn/hooks'
import ForwardRefDemo from './learn/2.forward-ref'
import ChildrenDemo from './learn/children'
import MemoDemo from './learn/memo'
import PortalDemo from './learn/portal'
import ControlDemo from './learn/1.control'

export default (
    <>
        <Route path="/ref" component={RefDeom} />
        <Route path="/forward-ref" component={ForwardRefDemo} />
        <Route path="/context" component={ContextDemo} />
        <Route path="/concurrent" component={ConcurrentModeDemo} />
        <Route path="/suspense" component={SuspenseDemo} />
        <Route path="/hooks" component={HooksDemo} />
        <Route path="/children" component={ChildrenDemo} />
        <Route path="/memo" render={() => <MemoDemo />} />
        <Route path="/portal" render={() => <PortalDemo />} />
        <Route path="/control_comp" component={ControlDemo} />
    </>
)
