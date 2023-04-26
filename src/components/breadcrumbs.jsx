import Link from 'next/link'
import { useRouter } from 'next/router';


export default function Breadcrumbs(props) {
    // const router = useRouter();

    const urlcrumbs = props.urlPath.split('/');
    const textcrumbs = props.urlPath.replace('-', ' ').split('/');
    // const newRoot = props.root.split('/', 3);
    textcrumbs.shift();
    urlcrumbs.shift();

    function partialURL(index) {
        let url = props.root + '/';
        for (let i = 0; i <= index; i++) {
            url += urlcrumbs[i];
            url += '/';
        }
        console.log(url);
        return url;

    }

    return (
        <div className="px-8 py-4">
            <h5 className="text-2xl">{props.title}</h5>
            <h6>
                Welcome [clientName] to Macrovesta.ai
                {/* <Link href={{ pathname: `/` }} >
                    <span>
                        Portal&nbsp;
                    </span>
                </Link>/ */}
                {/* {textcrumbs.map((child, index) =>

                (
                    <span>
                        {!child.startsWith('[') && (
                            <Link href={{ pathname: partialURL(index) }} >
                                <span className='capitalize'>
                                    &nbsp;{child}&nbsp;
                                </span>
                            </Link>
                        )}
                        {child.startsWith('[') && (
                            <Link href={{ pathname: partialURL(index) }} >
                                <span className='capitalize'>
                                    &nbsp;{props.router.query[`${child.slice(1, -1)}`]}&nbsp;
                                </span>
                            </Link>
                        )}
                        {index != textcrumbs.length - 1 && ('/')}
                    </span>
                )


                )} */}
                {/* <Link href={{ pathname: '/home' }} >
                    <span>
                        Portal /
                    </span>
                </Link>
                <Link href={{ pathname: '/products' }} >
                    <span>
                        &nbsp;Products&nbsp;
                    </span>
                </Link>
                / Overview */}
            </h6>
        </div>
    )
}