import {SocialMediaIconProps, SocialMediaLinks} from "@/app/components/links/NavLinks";
import {FooterFont} from "@/app/components/Fonts";

function SocialMediaIcon(props: SocialMediaIconProps) {
    const Icon = props.icon;

    return (
        <a
            href={props.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={props.name}
            title={props.name}
            className="hover:underline opacity-80"
            >
            <Icon />
        </a>
    )
}

export default function Footer() {
    return (
        <footer className="pb-1">
            <div className="text-foreground w-full flex gap-3 justify-center items-center text-2xl pb-1">
                {SocialMediaLinks.map((link) => (
                    <SocialMediaIcon
                        key={link.name}
                        name={link.name}
                        href={link.href}
                        icon={link.icon}
                    />
                ))}
            </div>

            <div className="text-foreground w-full flex justify-center items-center">
                <p className={`${FooterFont.className} opacity-50`}>© <span>{new Date().getFullYear()}</span> - ISO2T - All Rights Reserved.</p>
            </div>
        </footer>
    )
}