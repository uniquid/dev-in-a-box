import React from 'react'
import {Link} from 'react-router'
import Select from 'react-select'

const StepTwo = (props) => {
  let params
  if (props.recipe.length === 0) {
    params = ''
  } else {
    params = props.recipe[0].value
  }
  let paramVisible
  if (props.selectedRecipe.content[0]) {
    if (props.selectedRecipe.content[0].checked) {
      paramVisible = Number(props.selectedRecipe.content[0].name)
    }
  }

  let users = props.users.map(function (node) {
    let newNode = {
      value: '',
      label: ''
    }
    newNode.label = node.firstname + ' ' + node.lastname
    newNode.value = node.id
    return newNode
  })
  return (
    <div>
      <div id="secondary_header">
        <nav className="header_menu">
          <h4 className='menu_title'>Define contract</h4>
        </nav>
      </div>

      <div className='row'>
       <div className='medium-6 medium-centered columns'>
        <setion className='newContrat_recipe'>
          <h4 className='recipe_title'>Select the recipe</h4>
          <div className={props.providerSelected.length === 0 ? 'recipe_step1' : 'recipe_step1 deselected'}>Please select a node to view all the available recipes</div>
          <div className={props.providerSelected.length === 0 ? 'recipe_step2' : 'recipe_step2 selected'}>
            <div className='form_container'>
              <input className='selection_search' placeholder='search recipe archetype...' />
              <span className='icon-magnifying-glass'></span>
            </div>
            <div className='step2_recipeSelection'>
              <p>This device has 3 recipe available to implement</p>
              <div className='recipeSelection_list'>
                {/* <div className='list_item'>
                  <h4 className='item_title'>Guarantor</h4>
                  <div className='item_info'>
                    <span className='info_price'>Free</span>
                    <span className='info_downloads'>
                      <span className='icon-rocket'></span>
                      847
                    </span>
                  </div>
                </div> */}

                <div className={props.selectedRecipe.version === 0 ? 'list_item active' : 'list_item' } onClick={()=>props.selectRecipe(0)}>
                  <h4 className='item_title'>Access</h4>
                  <div className='item_info'>
                    <span className='info_price'>Free</span>
                    <span className='info_downloads'>
                      <span className='icon-rocket'></span>
                      847
                    </span>
                  </div>
                </div>
                <div className={props.selectedRecipe.version === 1 ? 'list_item active' : 'list_item' } onClick={()=>props.selectRecipe(1)}>
                  <h4 className='item_title'>uAuth</h4>
                  <div className='item_info'>
                    <span className='info_price'>Free</span>
                    <span className='info_downloads'>
                      <span className='icon-rocket'></span>
                      847
                    </span>
                  </div>
                </div>
              </div>
              <h4 className='recipeSelection_info'>Recipe info</h4>
              <div className={props.selectedRecipe.version === '' ? 'info_step1 active' : 'info_step1' }>
                Select the recipe to visualize the info
              </div>
              <div className={props.selectedRecipe.version === 0 ? 'info_step2 active' : 'info_step2' }>
                <h2 className='step2_title'>Access</h2>
                {/* <p className='step2_tagline'>Grant the access to the machine</p> */}
                <div className='step2_info'>
                  <div className='info_secondary'>
                    <h5 className='secondary_title'>adopters</h5>
                    <span className='secondary_value'>847</span>
                  </div>
                  <div className='info_secondary'>
                    <h5 className='secondary_title'>Creator</h5>
                    <span className='secondary_value'><a>marcop</a></span>
                  </div>
                </div>
                <div className='step2_readme'>
                  <h5 className='readme_title'>readme</h5>
                  <div className='readme_content'>If you are looking for a new way to promote your business that won’t cost you more money, maybe printing is one of the options you won’t resist. Printing is a widely use process in making printed materials that are used for advertising. Brochure, catalogs, flyers, banners, posters, and booklets are some of several examples of printed materials.</div>
                </div>
                <div className='attributes_recipe access active'>
                  <h2 className='attributes_title'>Attributes</h2>
                  {/* <p className='attributes_tagline'>Define the attributes of the recipe</p> */}
                  <form className='attributes_selection'>
                    <div className='list_item user checkbox clearfix'>
                      <input onChange={props.updateRecipe} id='33' name='provider' type='checkbox' value='Echo' />
                      <label htmlFor='33'>Echo</label>
                      {/* <span onClick={() => props.viewInfo('bit33')} className='icon-info'></span>
                      <div className={props.infoVisibility.bit33 ? 'item_description active' : 'item_description' }>
                        Returns back the input as sent by the user machine
                      </div> */}
                    </div>
                    <div className='list_item user checkbox clearfix'>
                      <input onChange={props.updateRecipe} id='34' name='provider' type='checkbox' value='open/close machine' />
                      <label htmlFor='34'>Open/Close Machine</label>
                      {/* <span onClick={() => props.viewInfo('bit34')} className='icon-info'></span>
                      <div className={props.infoVisibility.bit34 ? 'item_description active' : 'item_description' }>
                        Grants the user machine to open the tank contol panel
                      </div> */}
                    </div>
                    <div className='list_item user checkbox clearfix'>
                      <input onChange={props.updateRecipe} id='35' name='provider' type='checkbox' value='Input Faucet' />
                      <label htmlFor='35'>Input faucet</label>
                      {/* <span onClick={() => props.viewInfo('bit35')} className='icon-info'></span>
                      <div className={props.infoVisibility.bit35 ? 'item_description active' : 'item_description' }>
                        Grants the user machine to open the input faucet
                      </div> */}
                    </div>
                    <div className='list_item user checkbox clearfix'>
                      <input onChange={props.updateRecipe} id='36' name='provider' type='checkbox' value='Output Faucet' />
                      <label htmlFor='36'>Output faucet</label>
                      {/* <span onClick={() => props.viewInfo('bit36')} className='icon-info'></span>
                      <div className={props.infoVisibility.bit36 ? 'item_description active' : 'item_description' }>
                        Grants the user machine to open the output faucet
                      </div> */}
                    </div>
                    <div className='list_item user checkbox clearfix'>
                      <input onChange={props.updateRecipe} id='37' name='provider' type='checkbox' value='Get Status' />
                      <label htmlFor='37'>Get Status</label>
                      {/* <span onClick={() => props.viewInfo('bit37')} className='icon-info'></span>
                      <div className={props.infoVisibility.bit37 ? 'item_description active' : 'item_description' }>
                        Grant the user machine to check the provider status level
                      </div> */}
                    </div>
                  </form>
                </div>
                {/* <button className='step2_configure'><span className='icon-rocket'></span>Configure</button> */}
              </div>
              <div className={props.selectedRecipe.version === 1 ? 'info_step2 active' : 'info_step2' }>
                <h2 className='step2_title'>uAuth</h2>
                <div className='step2_info'>
                  <div className='info_secondary'>
                    <h5 className='secondary_title'>adopters</h5>
                    <span className='secondary_value'>847</span>
                  </div>
                  <div className='info_secondary'>
                    <h5 className='secondary_title'>Creator</h5>
                    <span className='secondary_value'><a>gmagnotta</a></span>
                  </div>
                </div>
                <div className='step2_readme'>
                  <h5 className='readme_title'>readme</h5>
                  <div className='readme_content'>If you are looking for a new way to promote your business that won’t cost you more money, maybe printing is one of the options you won’t resist. Printing is a widely use process in making printed materials that are used for advertising. Brochure, catalogs, flyers, banners, posters, and booklets are some of several examples of printed materials.</div>
                </div>
                <div className='configuration_attributes'>
                  <h2 className='attributes_title'>Attributes</h2>
                  <div className='attributes_recipe active'>
                    <form className='attributes_selection selection_list'>
                      <div className='list_item user clearfix'>
                        <input className='radio item_checkbox' onChange={props.updateParam} id='40' name='param' type='radio' value='uAuth' />
                        <label htmlFor='40'>uAuth</label>
                        <div className={paramVisible === 40 ? 'form_container param_selection' : 'form_container deactive'}>
                          <Select
                            options={users}
                            name='revocation_search'
                            value={params}
                            onChange={props.selectParam}
                          />
                        </div>
                      </div>

                      <div className='list_item user clearfix'>
                        <input className='radio item_checkbox' onChange={props.updateParam} id='41' name='param' type='radio' value='oAuth' />
                        <label htmlFor='41'>External oAuth</label>
                        {/* <span onClick={() => props.viewInfo('bit41')} className='icon-info'></span>
                        <div className={props.infoVisibility.bit41 ? 'item_description active' : 'item_description' }>
                          Returns back the input as sent by the user machine
                        </div> */}
                        <div className={paramVisible === 41 ? 'form_container param_selection' : 'form_container deactive'}>
                          <Select
                            options={users}
                            name='revocation_search'
                            value={params}
                            onChange={props.selectParam}
                          />
                          <div className='attributes_recipe access active'>
                            <h2 className='attributes_title'>Properties</h2>
                            {/* <p className='attributes_tagline'>Define the attributes of the recipe</p> */}
                            <div className='attributes_selection'>
                              <div className='list_item user checkbox clearfix'>
                                <input onChange={props.updateProperties} id='username' name='provider' type='checkbox' value='1' />
                                <label htmlFor='username'>Username</label>
                              </div>
                              <div className='list_item user checkbox clearfix'>
                                <input onChange={props.updateProperties} id='photo' name='provider' type='checkbox' value='2' />
                                <label htmlFor='photo'>Profile Photo</label>
                              </div>
                              <div className='list_item user checkbox clearfix'>
                                <input onChange={props.updateProperties} id='mail' name='provider' type='checkbox' value='4' />
                                <label htmlFor='mail'>Email</label>
                              </div>
                              <div className='list_item user checkbox clearfix'>
                                <input onChange={props.updateProperties} id='bio' name='provider' type='checkbox' value='8' />
                                <label htmlFor='bio'>Bio</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* <button className='step2_configure'><span className='icon-rocket'></span>Configure</button> */}
              </div>
            </div>
          </div>
        </setion>
        </div>
      </div>
    </div>
  )
}

export default StepTwo
