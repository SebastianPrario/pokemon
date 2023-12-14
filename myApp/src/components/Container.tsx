import {
  IonRow,
  IonCol,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonText,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import axios from 'axios';


const Container  =  () =>  {
   
  const [allPokemonId , setAllPokemonId ] = useState<number[]>([])
  const [ PokeCard, setPokeCard ] = useState<string[]>([])
  

  const generateItems = async (allPokemonsId : number[]) => {
    const newItems = [];
    for (let i = 0; i < 50; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${allPokemonsId[ 1 +PokeCard.length + i]}`
      const response = !!allPokemonsId && await axios.get(url)
      const data = response.data
      newItems.push(data);
      setPokeCard([...PokeCard, ...newItems]);
    }
  };

  const reload = () => {
    setPokeCard([])
    handleSortIds()
  }

  const getAllPokemon  = async () => {
    
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=1292`
    const response =  await axios.get(url)
    const data = response.data
    const idArray = data.results.map( (element : any) => {
        const id = element.url.split('/').slice(-2, -1)[0]
        return id
    }) 
    setAllPokemonId(idArray.sort( function (a : number, b : number ) {
             return Math.random() - 0.5;
            } ))
    ;
  }

  const handleSortIds : any = () => {
    const allIdArray = allPokemonId
    setAllPokemonId(allIdArray.sort( function (a, b) {
      return Math.random() - 0.5;
    }))
  }
  
  useEffect(() => {
    getAllPokemon();
  },[]);

  useEffect(() => {
    allPokemonId.length>10 && generateItems(allPokemonId)
  },[allPokemonId])
  
  useEffect(() => {
    PokeCard.length<1 && allPokemonId.length>50  && generateItems(allPokemonId)
  },[PokeCard])
 
 
  function handleRefresh (event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
    reload()
    event.detail.complete();
    }, 2000);
  }
 
  return (
    
    <IonContent className='ion-padding'>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent>
         
        </IonRefresherContent>
      </IonRefresher>
       <IonHeader slot="fixed"  >
            <IonToolbar >
              <IonTitle>Pokemon Api</IonTitle>
            </IonToolbar>
          </IonHeader>
      
        <IonGrid>
          <IonRow className='ion-justify-content-center'>
            <IonCol sizeLg='8' size='12'>
              <IonList >
                {!!PokeCard && PokeCard.map((item : any , index : number) => (
                  <IonItem key={index}>
                      <IonLabel>
                      <IonCard  color="warning">
                        <img src={item.sprites.other.home.front_default} alt={item.name}/>
                        <IonCardHeader>
                          <IonCardTitle>
                            {item.name}
                          </IonCardTitle>
                          id :{item.id}
                        </IonCardHeader>
                      <IonCardContent >   
                        <IonText color="primary" >
                          <h2> altura : {item.weight}</h2> 
                          <h2> peso : {item.height}</h2> 
                          <h2> experincia: {item.base_experience}</h2> 
                        </IonText>
                        <IonText color="dark" >
                          <h2> HABILIDADES </h2> 
                        </IonText>
                      {item.abilities.map ( (ability : any, index : number) => 
                        (
                          <IonText key={index}  color="primary" >
                           <h2> {index+1} {ability.ability.name}</h2> 
                          </IonText>
                        ))}
                        </IonCardContent>
                      </IonCard>
                      </IonLabel>
                    </IonItem>
                      ))}
            </IonList>
           </IonCol>
        </IonRow>
      </IonGrid>
      <IonInfiniteScroll
        onIonInfinite={(ev) => {
          generateItems(allPokemonId);
          setTimeout(() => ev.target.complete(), 500);
        }}
      >
      <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  )
}
export default Container