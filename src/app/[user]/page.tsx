export default async function Userpage({params}: {params: Promise<{user: string}>}) {
    const { user } = await params;
    return (<></>);
}