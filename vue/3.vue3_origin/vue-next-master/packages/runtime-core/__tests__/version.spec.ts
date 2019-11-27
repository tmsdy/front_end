import { version } from '../src'
import lernaJson from '../../../lerna.json.js'

test('version', () => {
    expect(version).toBe(lernaJson.version)
})
