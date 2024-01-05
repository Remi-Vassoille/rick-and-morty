import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { Character } from '../character';
import { Location } from '../location';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {
  searchForm!: FormGroup; //form group for the character research
  characters: Character[] = []; //will contain a page of characters
  character!: Character; //will contain the selected character
  page = 1; //current page number
  tempPage= 1; //allow to manage when page is not found by going back to previous value of page
  displayAll = true; //to know if we display all the characters or only the selected one
  isEmpty=false; //true if characters isempty

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCharacter(this.apiService.characterId).subscribe(data => {
      this.character = data; //initilalize a default selected character
    });
    this.displayAll = !this.apiService.displayCharacter; //manage redirection from episode or location component to selected character
    this.apiService.displayCharacter = false;

    this.apiService.getCharacters(this.page).subscribe(data => {
      this.characters = data; //get a page of characters
    });

    this.searchForm = this.fb.group({
      searchInput: [''] //init searchInput
    });
  
    this.searchForm.get('searchInput')!.valueChanges.subscribe(() =>{
      this.page=1
      this.tempPage=1
      this.getCharacterPage(this.page) //get a new page of character based on the updated input value
    });
  }

  getCharacterPage(page:number){
    const searchInput = this.searchForm.get('searchInput')?.value;
    this.apiService.getCharactersPage(page, searchInput).subscribe(data => { 
      if(data.length === 0){ //if no next page or no character corresponding to the research 
        if(this.tempPage!=this.page){
          this.getCharacterPage(this.page) //the funtion call itself but with the previous value of page to get a proper data
        }
        else{
          this.isEmpty=true
          this.characters=[] //set characters as empty
        }
        this.tempPage=this.page //stay on the previous page
      }
      else{ //else get the data
        this.isEmpty=false
        this.page=this.tempPage
        this.characters=data
      }
    })
  }

  goRightPage(){ //get the next page
    this.tempPage=this.page+1 
    this.getCharacterPage(this.tempPage) 
  }

  goLeftPage(){ //get the previous page
    this.tempPage=this.page-1
    if(this.tempPage<1){this.tempPage=1}
    this.getCharacterPage(this.tempPage)
  }

  getSelectedCharacter(id: number){ //get the selected char by is Id number
    this.apiService.getCharacter(id).subscribe(data => { 
      this.character=data
      this.displayAll=false
    })
  }

  goMainPage(){ //set displayAll at true in order to display all the characters
    this.displayAll=true
  }
}