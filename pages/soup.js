
import { useState, useEffect, Fragment } from 'react'
import Container from 'react-bootstrap/Container'
import { getSoup } from '../lib/getSoup';
import Table from 'react-bootstrap/Table'



export default function Soup() {

    const grabItems = [
        { level: 'n5', target: '06-noun-position.php' },
        { level: 'n5', target: '07-noun-food.php' },
        { level: 'n5', target: '09-noun-traffic.php' },
        { level: 'n4', target: '06-noun-nature.php' }
    ]

    const [items, setItems] = useState([])
    const [itemHeaders, setItemHeaders] = useState([])

    useEffect(() => {
        (async () => {

            const responseArr = await getSoup(grabItems)

            setItemHeaders(Object.keys(responseArr.find(x => x)))

            setItems(responseArr)

        })()

    }, [])

    if (items.length <= 0) return (
        <Fragment>
            <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
                {'Loading'}
            </Container>
        </Fragment>
    )

    return (
        <Fragment>
            <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            {itemHeaders.map((item, idx) => {
                                return <th key={idx}>{item}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    {itemHeaders.map((hdrItem, hdrIdx) => {
                                        return <td key={hdrIdx}>{item[hdrItem]}</td>
                                    })}
                                </tr>
                            )
                        })}

                    </tbody>
                </Table>
            </Container>

        </Fragment>
    )
}

