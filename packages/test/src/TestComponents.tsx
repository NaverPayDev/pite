import classNames from 'classnames/bind'

import styles from './hello.module.scss'

const cx = classNames.bind(styles)

export default function Test() {
    return <div className={cx('article')}>hello</div>
}
