import React from 'react'
import { Route } from 'react-router-dom'

import RefDeom from './demos/1.ref'
import ContextDemo from './demos/3.context'
import ConcurrentModeDemo from './demos/4.concurrent-mode'
import SuspenseDemo from './demos/5.suspense'
import HooksDemo from './demos/hooks'
import ForwardRefDemo from './demos/2.forward-ref'
import ChildrenDemo from './demos/children'
import MemoDemo from './demos/memo'
import PortalDemo from './demos/portal'
import ControlDemo from './demos/1.control'

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
