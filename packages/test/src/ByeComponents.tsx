import classNames from 'classnames/bind'

import styles from './bye.module.scss'

const cx = classNames.bind(styles)

export function Bye() {
    return <span className={cx('account')}>span</span>
}
