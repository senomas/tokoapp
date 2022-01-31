import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import DataGrid from '@supabase/react-data-grid';

const ItemCategory: NextPage = () => {
  const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
  ]
  const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
  ]
  return (
    <div className={styles.container}>
      <Head>
        <title>Item Category</title>
        <meta name="description" content="TokoApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <DataGrid columns={columns} rows={rows} />
      </main>
    </div>
  )
}

export default ItemCategory
