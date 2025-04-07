import classNames from 'classnames/bind'

import style from './Bar.module.scss'

const cx = classNames.bind(style)

export interface Option {
    name: string
    content: string
}

const Bar = () => {
    const options: Option[] = [
        {name: 'foo', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
        {name: 'bar', content: 'Mauris vitae volutpat est. Donec vitae mattis est, quis suscipit mi.'},
        {name: 'baz', content: 'Donec mattis gravida felis id ullamcorper.'},
    ]

    return (
        <div>
            {options.map(({name, content}) => (
                <p key={name} className={cx(name)}>
                    {content}
                </p>
            ))}
        </div>
    )
}

export default Bar
