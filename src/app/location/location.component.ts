import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Location } from '../location';
import { Character } from '../character';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit{
  locations: Location[] = []; //will contain a page of locations
  location!: Location; //will contain the selected location
  characters: Character[] = []; //will contain characters that are in the selected location
  character!: Character; //will contain the selected character
  page = 1; //current page number
  tempPage=1; //allow to manage when page is not found by going back to previous value of page
  displayAll=true; //to know if we display the episodes or the selected character

  constructor(private apiService: ApiService, private router: Router){}

  ngOnInit(): void {
    this.apiService.getLocation(1).subscribe(data => { 
      this.location=data //initilalize a default selected location
    })
    this.getLocationPage(1) //initialize a first page of episodes
  }

  getLocationPage(page:number){
    this.apiService.getLocations(page).subscribe(data => {
      if(data.length === 0){
        this.tempPage=this.page //if no next page, stay on the previous one
      }
      else{
        this.page=this.tempPage //else update current page
        this.locations=data //and get the data
      }
    })
  }

  goRightPage(){ //get the next page
    this.tempPage=this.page+1
    this.getLocationPage(this.tempPage)
  }

  goLeftPage(){ //get the previous page
    this.tempPage=this.page-1
    if(this.tempPage<1){this.tempPage=1}
    this.getLocationPage(this.tempPage)
  }

  getSelectedLocation(id: number) {
    this.apiService.getLocation(id).subscribe((data) => {
      this.location = data; //get a location by its Id
      this.characters = [];

      //get the characters on the location by the URL present in the data of location
      const characterObservables = this.location.residents.map((characterUrl) =>
        this.apiService.getCharacterByUrl(characterUrl) 
      );
      forkJoin(characterObservables).subscribe((charactersData) => {
        this.characters = charactersData;
      });
    });
    this.displayAll = false;
  }

  goToSelectedCharacter(id:number){ //get the selected char by is Id number and redirect to character component to display it
    this.apiService.characterId=id;
    this.apiService.displayCharacter=true
    this.router.navigate(['/character']);
  }

  goMainPage(){ //set displayAll at true in order to display all the characters
    this.displayAll=true
  }
}
