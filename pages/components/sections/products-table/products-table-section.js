import {
  Page,
  Card,
  Stack,
  Pagination
} from "@shopify/polaris";
import useSWR, { mutate } from "swr";

import {restFetchWrapper} from "../../../../react-utils/request-handler";
import { useState, useEffect } from "react";
import ProductsTable from "./components/products-table";
import SearchBar from "./components/search-bar"



const appBaseUrl = HOST;

var nestedProperty = require("nested-property");


function getProductQueryString(cursor, searchQuery) {
  return `${appBaseUrl}/get-products?${cursor ? `cursor=${cursor}` : ''}${searchQuery ? `&searchQuery=${searchQuery}` : ''}`
}


function ProductsTableSection({restFetch, toggleMainLoader}) {

  const [pageCursor, setCurrentPageCursor] = useState(function () {
    return "";
  });

  const [searchQuery, setSearchQuery] = useState(function () {
    return "";
  });
  const [searchQueryItem, setSearchQueryItem] = useState(function () {
    return "";
  });


  const [pageInfo, setPageInfo] = useState(function () {
    return { hasNextPage: true, hasPreviousPage: false, nextCursor: "" };
  });
  const [prevCursors, setPrevPageCursor] = useState(function () {
    return [];
  });

  const { data, error } = useSWR(
    getProductQueryString(pageCursor, searchQuery), restFetchWrapper(restFetch)
  );

  //Prefetch the next page.
  useSWR(getProductQueryString(pageInfo.nextCursor, searchQuery), restFetchWrapper(restFetch));


  useEffect(() => {
    toggleMainLoader(() => true);
  }, []);

  useEffect(() => {

    if (data) {
      setPageInfo((pageInfo) => {
        return {
          ...pageInfo,
          ...(nestedProperty.get(data,`products.0.pageInfo`) || {}),
          nextCursor:
          nestedProperty.get(data,`products.0.cursor`),
        };
      });
      toggleMainLoader(() => false);
    }else{
      console.log(error);
    }
  }, [data, error]);

  function handleNextPageClick() {
    setPrevPageCursor(function (prevCursors) {
      return [...prevCursors, pageCursor];
    });
    setCurrentPageCursor(function () {
      return pageInfo.nextCursor;
    });
  }

  function handleLastPageClick() {
    setPrevPageCursor(function () {
      return prevCursors.slice(0, -1);
    });
    setCurrentPageCursor(function () {
      return prevCursors[prevCursors.length - 1];
    });
  }

  async function clearFetchedData(){
    toggleMainLoader(() => true);
    setTimeout(() => toggleMainLoader(() => false), 2000);
    await mutate(getProductQueryString(pageCursor));
  }

  function handleQueryChange(value) {
    setSearchQueryItem(function () {
      return value;
    });
  }
  function lunchSearch() {
    setSearchQuery(function () {
      return searchQueryItem;
    });
  }

  function handleClearButton() {
    setSearchQueryItem(function () {
      return "";
    });
    setSearchQuery(function () {
      return "";
    });
  }


  return (
    <>
    <Page title="Products" fullWidth>
      {
          <>
        <Card>
            <SearchBar
              value={searchQueryItem}
              handleQueryChange={handleQueryChange}
              handleClearButton={handleClearButton}
              lunchSearch={lunchSearch}
              />
        </Card>
        <Card>
          <>
            <Card.Section>
              <ProductsTable
                data={data}
                clearFetchedData={clearFetchedData}
                restFetch={restFetch}
                />
              </Card.Section>
              <Stack distribution="center">
                <div className="p-8">
                  <Pagination
                    hasPrevious={pageInfo.hasPreviousPage}
                    onPrevious={handleLastPageClick}
                    hasNext={pageInfo.hasNextPage}
                    onNext={handleNextPageClick}
                  />
                </div>
              </Stack>
            </>
        </Card>
      </>
      }
    </Page>
  </>
  );
}

export default ProductsTableSection;
