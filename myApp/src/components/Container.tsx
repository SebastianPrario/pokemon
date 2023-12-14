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
  IonAvatar,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
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
   
  const [allPokemon , setAllPokemon ] = useState<number[]>([])
  const [ items, setItems ] = useState<string[]>([])
  

  const generateItems = async (allPokemonsId : number[], deleteItems? : boolean) => {
    if (deleteItems) setItems([])
    const newItems = [];
    for (let i = 0; i < 50; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${allPokemonsId[ 1 +items.length + i]}`
      const response = !!allPokemonsId && await axios.get(url)
      const data = response.data
      newItems.push(data);
    setItems([...items, ...newItems]);
    }
  };

  const reload = () => {
    setItems([])
    handleSortIds()
  }

  const getAllPokemon  = async () => {
    
    const allPokemon : number [] = []
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=1292`
    const response =  await axios.get(url)
    const data = response.data
    const idArray = data.results.map( (element : any) => {
        const id = element.url.split('/').slice(-2, -1)[0]
        return id
    }) 
    setAllPokemon(idArray.sort( function (a : number, b : number ) {
             return Math.random() - 0.5;
            } ))
    !!allPokemon && generateItems(allPokemon);
  }

  const handleSortIds : any = () => {
    const allIdArray = allPokemon
    setAllPokemon(allIdArray.sort( function (a, b) {
      return Math.random() - 0.5;
    }))
  }
  
  useEffect(() => {
    getAllPokemon();
  },[]);

  useEffect(() => {
    allPokemon.length>0 && generateItems(allPokemon)
  },[allPokemon])
  
  useEffect(() => {
    items.length<1 && generateItems(allPokemon)
    console.log(items[0])
  },[items])
 
 
  function handleRefresh (event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
    reload()
    console.log(items)
    event.detail.complete();
    }, 2000);
  }


  return (
    
    <IonContent fullscreen={true} className='ion-padding'>
  
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent>
          <IonHeader translucent={true}>
            <IonToolbar >
              <IonTitle>Pokemon Api</IonTitle>
            </IonToolbar>
          </IonHeader>
        </IonRefresherContent>
      </IonRefresher>
      
      <IonInfiniteScroll
          onIonInfinite={(ev) => {
            generateItems(allPokemon);
            setTimeout(() => ev.target.complete(), 500);
          }}
        >
        <IonGrid>
          <IonRow className='ion-justify-content-center'>
            <IonCol size='6'text-center>
              <IonInfiniteScrollContent>
              <IonList >
                {!!items && items.map((item : any , index : number) => (
                  <IonItem key={index}>
                      <IonLabel>
                      <div className='div'>
                      <IonRow class="ion-align-items-center">
                        <IonCol size='5'>
                          <img src={item.sprites.front_default} alt={item.name}/>
                        </IonCol>
                        <IonCol size='5'>
                        <IonText color="tertiary">
                          <h1>{item.name}</h1>
                        </IonText>
                        </IonCol>
                        <IonCardTitle>id :{item.id}</IonCardTitle>
                        </IonRow>
                        <IonCardHeader>
                       
                        </IonCardHeader>
                    
                      <IonCardContent color='primary'>   
                        <IonText color="primary" >
                          <h1> altura :{item.weight}</h1> 
                          <h1> peso :{item.height}</h1> 
                          <h1> experincia: {item.base_experience}</h1> 
                        </IonText>
                      </IonCardContent>
                      <IonCardContent>peso :{item.height}</IonCardContent>
                      <IonCardContent>experincia: {item.base_experience}</IonCardContent>
                      {item.abilities.map ( (ability : any) => 
                        (
                          <IonText color="primary" >
                          <h1> {ability.ability.name}</h1> 
                          </IonText>
                        ))}
                      </div>
                      </IonLabel>
                    </IonItem>
                      ))}
            </IonList>
            </IonInfiniteScrollContent>
          </IonCol>
        </IonRow>
      </IonGrid>
      </IonInfiniteScroll>
    </IonContent>
  )
}

export default Container