import classNames from 'classnames/bind'

import style from './Foo.module.scss'

const cx = classNames.bind(style)

const Foo = () => {
    return (
        <div>
            <p className={cx('foo')}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <p className={cx('bar')}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <p className={cx('baz')}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    )
}

export default Foo
