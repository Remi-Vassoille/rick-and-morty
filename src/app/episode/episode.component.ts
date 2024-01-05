import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Episode } from '../episode';
import { Character } from '../character';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit{
  
  episodes: Episode[] = []; //will contain a page of episodes
  episode!: Episode; //will contain the selected episode
  characters: Character[] = []; //will contain characters that are in the selected episode
  character!: Character; //will contain the selected character
  page = 1; //current page number
  tempPage=1; //allow to manage when page is not found by going back to previous value of page
  displayAll=true; //to know if we display the episodes or the selected character

  constructor(private apiService: ApiService, private router: Router){}

  ngOnInit(): void {
    this.apiService.getEpisode(1).subscribe(data => { 
      this.episode=data //initilalize a default selected episode
    })
    this.getEpisodePage(1) //initialize a first page of episodes
  }

  getEpisodePage(page:number){
    this.apiService.getEpisodes(page).subscribe(data => {
      if(data.length === 0){
        this.tempPage=this.page //if no next page, stay on the previous one
      }
      else{
        this.page=this.tempPage //else update current page
        this.episodes=data //and get the data
      }
    })
  }

  goRightPage(){ //get the next page
    this.tempPage=this.page+1
    this.getEpisodePage(this.tempPage)
  }

  goLeftPage(){ //get the previous page
    this.tempPage=this.page-1
    if(this.tempPage<1){this.tempPage=1}
    this.getEpisodePage(this.tempPage)
  }

  getSelectedEpisode(id: number) {
    this.apiService.getEpisode(id).subscribe((data) => {
      this.episode = data; //get an episode by its Id
      this.characters = [];

      //get the characters on the episode by the URL present in the data of episode
      const characterObservables = this.episode.characters.map((characterUrl) =>
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