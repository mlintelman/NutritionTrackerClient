import SearchBar from "./SearchBar/SearchBar"

export default function( {onSelect}) {

    return(
        <>
        <SearchBar onSelect={handleFoodSelect}/>
        <input
            type='checkbox'

        />
        </>
    )
}