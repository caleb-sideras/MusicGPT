import Image from 'next/image'


export default function ImageExample() {
    return <Image
        src='/example_plot.png'
        width={499}
        height={427}
        alt='Example Visualization'
        className='m-auto'
        priority
    />
}