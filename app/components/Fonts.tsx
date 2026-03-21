import { Exo, SN_Pro } from 'next/font/google'

export const HeaderFont = SN_Pro()

export const SubHeaderFont = Exo({
    style: ['italic']
})

export const BodyFont = Exo({
    variable: '--font-exo',
})

export const FooterFont = SN_Pro()