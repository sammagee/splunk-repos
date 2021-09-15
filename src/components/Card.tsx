import React, { FunctionComponent, ReactElement } from 'react'

interface CardProps {
  title: string
  actions?: ReactElement | string
  children: ReactElement | string
  footer: ReactElement | string
}

const Card: FunctionComponent<CardProps> = ({
  title,
  actions,
  children,
  footer,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-md">
      <header className="flex items-center justify-between bg-gray-100 border-b border-gray-300 px-4 py-2 rounded-t-md">
        <h2 className="text-sm text-gray-900 font-semibold">{title}</h2>

        {actions}
      </header>

      <div className="divide-y divide-gray-300">{children}</div>

      <footer className="bg-gray-100 border-t border-gray-300 px-4 py-2 rounded-b-md">
        {footer}
      </footer>
    </div>
  )
}

export default Card
