type ListProps = {
    title: string;
    children: string;
    section?: string;
}

export default function ListItem({ title, children, section = 'pro' }: ListProps) {
    return <div className={`focus:shadow-[0_0_0_2px] focus:shadow-violet7 hover:bg-mauve3 block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors`}>
        {section === 'lite' ? (
            <>
                <div className="text-violet12 mb-[5px] font-medium leading-[1.2] text-on-secondary">
                    {title}
                </div>
                <p className="text-mauve11 leading-[1.4] text-secondary-container">{children}</p>
            </>
        ) : section === 'pro' ? (
            <>
                <div className="text-violet12 mb-[5px] font-medium leading-[1.2] text-inverse-on-surface">
                    {title}
                </div>
                <p className="text-mauve11 leading-[1.4] text-inverse-on-surface">{children}</p>
            </>
        ) : (
            <>
                <div className="text-violet12 mb-[5px] font-medium leading-[1.2] text-on-tertiary">
                    {title}
                </div>
                <p className="text-mauve11 leading-[1.4] text-tertiary-container">{children}</p>
            </>
        )}
    </div>
};