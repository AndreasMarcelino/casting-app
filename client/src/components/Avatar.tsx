import { useState } from 'react'
import clsx from 'clsx'

interface Props {
  nama: string
  fotoLink?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-20 h-20 text-2xl',
}

export default function Avatar({ nama, fotoLink, size = 'sm', className }: Props) {
  const [imgError, setImgError] = useState(false)
  const initials = nama.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()

  return (
    <div className={clsx(
      'rounded-full flex-shrink-0 flex items-center justify-content-center overflow-hidden',
      'bg-gradient-to-br from-[#2a2000] to-[#1a1000] border border-[#2a2a2a]',
      'font-display font-bold text-gold items-center justify-center',
      sizes[size], className
    )}>
      {fotoLink && !imgError
        ? <img src={fotoLink} alt={nama} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        : initials
      }
    </div>
  )
}
