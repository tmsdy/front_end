import BaseStyleSheet from '../../common/BaseStyleSheet'

const OneKeyStyle = BaseStyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#FFFCF8',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40
  },
  borderTop: {
    borderTopWidth: BaseStyleSheet.hairlineWidth,
    borderTopColor: '#FFF0DD',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#333'
  },
  noticeButton: {
    minWidth: 75,
    height: 28,
    borderRadius: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Bold
  },
  textButton: {
    width: 75,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  noticeIcon: {
    width: 7,
    height: 12,
    marginLeft: 5
  },
  noticeButtonText: {
    fontSize: 12,
    color: '#333'
  }
})

export default OneKeyStyle
