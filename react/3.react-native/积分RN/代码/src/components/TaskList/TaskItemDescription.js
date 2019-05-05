/**
 * Created by liuzhimeng.
 * @date 2019-04-02
 * @description 任务列表内子项描述信息
 */

import React from 'react'
import PropTypes from 'prop-types'

import {Text} from '@iqiyi/rn-ui'

export default function TaskItemDescription({data}) {
  if(!data) return null

  if(typeof data === 'string') {
    return <Text style={styles.container}>{data}</Text>
  }

  return (
    <Text style={styles.container}>
      {data.map((text, key) => {
        // eslint-disable-next-line react/no-array-index-key
        return /^hl\|/.test(text) ? <Text key={`${text}_${key}`} style={styles.descHighlight}>{text.slice(3)}</Text> : text
      })}
    </Text>
  )
}
TaskItemDescription.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ])
}

const styles = BaseStyleSheet.create({
  container: {
    height: 19,
    lineHeight: 19,
    fontSize: 12,
    color: '#999999',
  },
  descHighlight: {
    color: '#FF8A1F',
  }
})
