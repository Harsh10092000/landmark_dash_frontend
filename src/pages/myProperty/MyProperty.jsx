import React, { useState, useEffect, useRef } from 'react';
import { LoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
const MyProperty = () => {
    const libraries = ["places"];

    const [activeTab, setActiveTab] = useState('Basic Details');
    const [formSubmit, setFormSubmit] = useState(false);
    const [formData, setFormData] = useState({
        adType: '',
        userType: '',
        propertyType: '',
        propertySubType: '',
        plotNumber: '',
        state: '',
        city: '',
        subDistrict: '',
        locality: '',
        completeAddress: '',
    });

    const tabs = [
        {
            label: 'Basic Details',
            isSelected: activeTab === 'Basic Details',
            length: null,
        },
        {
            label: 'Location Details',
            isSelected: activeTab === 'Location Details',
            length: null,
        },
        {
            label: 'Property Details',
            isSelected: activeTab === 'Property Details',
            length: null,
        },
        {
            label: 'Property Images',
            isSelected: activeTab === 'Property Images',
            length: null,
        },
        {
            label: 'Pricing & Others',
            isSelected: activeTab === 'Pricing & Others',
            length: null,
        },
    ];

    const handleTabClick = (label) => {
        setActiveTab(label);
        let ref = null;
        if (label === 'Basic Details') ref = basicDetailsRef;
        else if (label === 'Location Details') ref = locationDetailsRef;
        else if (label === 'Property Details') ref = propertyDetailsRef;
        else if (label === 'Property Images') ref = propertyImagesRef;
        else if (label === 'Pricing & Others') ref = pricingOthersRef;
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


    const adTypes = [
        { label: "Sale", icon: "🟢" },
        { label: "Rent", icon: "🔴" },
    ];
    const userTypes = [
        { label: "Broker", icon: "🧑‍💼" },
        { label: "Owner", icon: "👤" },
    ];
    const proTypes = [
        { value: "Residential", icon: "🏠" },
        { value: "Land", icon: "🌱" },
        { value: "Commercial", icon: "🏢" },
    ];
    const proResSubTypes = [
        { value: "Apartment,Residential", item: "Apartment" },
        { value: "Independent House,Residential", item: "Independent House" },
        { value: "Builder Floor,Residential", item: "Builder Floor" },
        { value: "Farm House,Residential", item: "Farm House" },
        { value: "Raw House,Residential", item: "Raw House" },
        { value: "Retirement Community,Residential", item: "Retirement Community" },
        { value: "Studio Apartment,Residential", item: "Studio Apartment" },
        { value: "RK,Residential", item: "RK" },
    ];
    const proLandSubTypes = [
        { value: "Residential Land,Land", item: "Residential Land" },
        { value: "Commercial Land,Land", item: "Commercial Land" },
        { value: "Industrial Land,Land", item: "Industrial Land" },
        { value: "Agricultural Land,Land", item: "Agricultural Land" },
        { value: "Farm House Land,Land", item: "Farm House Land" },
        { value: "Institutional Land,Land", item: "Institutional Land" },
    ];
    const proCommercialSubTypes = [
        { value: "Retail Showroom,Commercial", item: "Retail Showroom" },
        { value: "Commercial Building,Commercial", item: "Commercial Building" },
        { value: "Office Complex,Commercial", item: "Office Complex" },
        { value: "Software Technology Park,Commercial", item: "Software Technology Park" },
        { value: "Warehouse,Commercial", item: "Warehouse" },
        { value: "Industrial Estate,Commercial", item: "Industrial Estate" },
        { value: "Institutional Building,Commercial", item: "Institutional Building" },
        { value: "Petrol Pump,Commercial", item: "Petrol Pump" },
        { value: "Cold Store,Commercial", item: "Cold Store" },
    ];

    let subTypes = [];
    if (formData.propertyType === "Residential") subTypes = proResSubTypes;
    else if (formData.propertyType === "Land") subTypes = proLandSubTypes;
    else if (formData.propertyType === "Commercial") subTypes = proCommercialSubTypes;

    const autocompleteRef = useRef(null);
    const [location, setLocation] = useState("");
    const [showManualFields, setShowManualFields] = useState(false);

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.address_components) {
                setShowManualFields(false);
                setFormData({ ...formData, plotNumber: "" });
                setFormData({ ...formData, state: "" });
                setFormData({ ...formData, city: "" });
                setFormData({ ...formData, subDistrict: "" });
                setFormData({ ...formData, locality: "" });
                setFormData({ ...formData, completeAddress: "" });
                setFormData({ ...formData, pinCode: "" });

                place.address_components.forEach((component) => {
                    const type = component.types[0];
                    console.log(place);
                    switch (type) {
                        case "street_number":
                            setFormData({ ...formData, plotNumber: component.long_name });
                            break;
                        case "administrative_area_level_1":
                            console.log(component.long_name)
                            setFormData({ ...formData, state: component.long_name });
                            break;
                        case "administrative_area_level_3":
                            setFormData({ ...formData, subDistrict: component.long_name });
                            break;
                        case "locality":
                            setFormData({ ...formData, city: component.long_name });
                            break;
                        case "sublocality_level_1":
                        case "neighborhood":
                            setFormData({ ...formData, locality: component.long_name });
                            break;
                        case "postal_code":
                            setFormData({ ...formData, pinCode: component.long_name });
                            break;
                        default:
                            break;
                    }
                });
                setFormData({ ...formData, completeAddress: place.formatted_address || "" });
            }
        }
    };

    const basicDetailsRef = useRef(null);
    const locationDetailsRef = useRef(null);
    const propertyDetailsRef = useRef(null);
    const propertyImagesRef = useRef(null);
    const pricingOthersRef = useRef(null);

    const sectionRefs = [
        { label: 'Basic Details', ref: basicDetailsRef },
        { label: 'Location Details', ref: locationDetailsRef },
        { label: 'Property Details', ref: propertyDetailsRef },
        { label: 'Property Images', ref: propertyImagesRef },
        { label: 'Pricing & Others', ref: pricingOthersRef },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120; // 120 = offset for sticky header, adjust as needed
            let currentSection = 'Basic Details';
            for (let i = 0; i < sectionRefs.length; i++) {
                const section = sectionRefs[i].ref.current;
                if (section) {
                    const { top } = section.getBoundingClientRect();
                    if (top + window.scrollY - 130 <= scrollPosition) { // 130 = offset, adjust as needed
                        currentSection = sectionRefs[i].label;
                    }
                }
            }
            setActiveTab(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <LoadScript
                googleMapsApiKey="AIzaSyDLzo_eOh509ONfCjn1XQp0ZM2pacPdnWc"
                libraries={libraries}
            >
                <div className='dashboard-main-wrapper'>
                    <div className="tab_section_wrapper">
                        <div className="tab_section">
                            {tabs.map((tab) => (
                                <div
                                    key={tab.label}
                                    onClick={() => handleTabClick(tab.label)}
                                    className={`tab_section-item ${tab.isSelected ? 'tab_section-item-selected' : ''}`}
                                >
                                    {tab.label}
                                    {tab.length !== null && (
                                        <span className="tab-section-length">{tab.length}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='main-wrapper'>
                    <div ref={basicDetailsRef} className='row myproperty-section'>
                        {/* Minimal, modern Basic Details heading using class only */}
                        <div className="myproperty-section-title-minimal">Basic Details</div>
                        <div className="col-md-12 inside-section-wrapper">
                            <label className="myproperty-label">Ad Type <span style={{ color: '#ec161e' }}>*</span></label>
                            <div className="myproperty-pill-group">
                                {adTypes.map((type) => (
                                    <button
                                        key={type.label}
                                        className={`myproperty-pill${formData.adType === type.label ? " selected" : ""}`}
                                        onClick={() => setFormData({ ...formData, adType: type.label })}
                                        type="button"
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                            {formSubmit && !formData.adType && <div className="myproperty-error-msg">Ad Type is required</div>}
                        </div>
                        <div className=" col-md-12 inside-section-wrapper">
                            <label className="myproperty-label">Property Type <span style={{ color: '#ec161e' }}>*</span></label>
                            <div className="myproperty-pill-group">
                                {proTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        className={`myproperty-pill${formData.propertyType === type.value ? " selected" : ""}`}
                                        onClick={() => {
                                            setFormData({ ...formData, propertyType: type.value, propertySubType: "" });
                                        }}
                                        type="button"
                                    >
                                        {type.value}
                                    </button>
                                ))}
                            </div>
                            {formSubmit && !formData.propertyType && <div className="myproperty-error-msg">Property Type is required</div>}
                        </div>
                        <div className=" col-md-12 inside-section-wrapper">
                            <label className="myproperty-label">Property Sub Type <span style={{ color: '#ec161e' }}>*</span></label>
                            <div className="myproperty-pill-group myproperty-pill-group-wrap">
                                {subTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        className={`myproperty-pill${formData.propertySubType === type.value ? " selected" : ""}`}
                                        onClick={() => setFormData({ ...formData, propertySubType: type.value })}
                                        type="button"
                                    >
                                        {type.item}
                                    </button>
                                ))}
                            </div>
                            {formSubmit && !formData.propertySubType && <div className="myproperty-error-msg">Property Sub Type is required</div>}
                        </div>
                    </div>

                    <div ref={locationDetailsRef} className='row myproperty-section'>
                        <div className="myproperty-section-title-minimal">Location Details</div>
                        <div className="col-md-12 inside-section-wrapper">
                            <label className="myproperty-label">
                                Location Details <span style={{ color: '#ec161e' }}>*</span>
                            </label>
                            <div className="location-input-group">
                                <Autocomplete
                                    onLoad={onLoad}
                                    onPlaceChanged={onPlaceChanged}
                                    options={{
                                        types: ["geocode"],
                                        componentRestrictions: { country: "in" },
                                    }}
                                >
                                    <input
                                        id="location-input"
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="Enter location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </Autocomplete>
                                <div className="myproperty-location-divider">
                                    <span>Or</span>
                                </div>
                            </div>
                        </div>
                        <div className="auto-filled-fields">
                            <div className="myproperty-location-autofill-row">
                                <div style={{flex:1}} className='col-md-4'>
                                    <label className="myproperty-label">Plot Number</label>
                                    <input
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="Plot Number"
                                        value={formData.plotNumber}
                                        onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                                    />
                                    {formSubmit && !formData.plotNumber && <div className="myproperty-location-error">Plot Number is required</div>}
                                </div>
                                <div style={{flex:1}} className='col-md-4'>
                                    <label className="myproperty-label">State</label>
                                    <input
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                    {formSubmit && !formData.state && <div className="myproperty-location-error">State is required</div>}
                                </div>
                                <div style={{flex:1}} className='col-md-4'>
                                    <label className="myproperty-label">City</label>
                                    <input
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                    {formSubmit && !formData.city && <div className="myproperty-location-error">City is required</div>}
                                </div>
                            </div>
                            <div className="myproperty-location-autofill-row">
                                <div style={{flex:1}} className='col-md-4'>
                                    <label className="myproperty-label">Sub District</label>
                                    <input
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="Sub District"
                                        value={formData.subDistrict}
                                        onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                                    />
                                    {formSubmit && !formData.subDistrict && <div className="myproperty-location-error">Sub District is required</div>}
                                </div>
                                <div style={{flex:1}} className='col-md-4'>
                                    <label className="myproperty-label">Locality</label>
                                    <input
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="Locality"
                                        value={formData.locality}
                                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                                    />
                                    {formSubmit && !formData.locality && <div className="myproperty-location-error">Locality is required</div>}
                                </div>
                                <div style={{flex:1}} className='col-md-4'>
                                    <label className="myproperty-label">Complete Address</label>
                                    <input
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="Complete Address"
                                        value={formData.completeAddress}
                                        onChange={(e) => setFormData({ ...formData, completeAddress: e.target.value })}
                                    />
                                    {formSubmit && !formData.completeAddress && <div className="myproperty-location-error">Complete Address is required</div>}
                                </div>
                            </div>
                            <div className="myproperty-location-autofill-row">
                                <div style={{flex:1}} className='col-md-4'>
                                    <label className="myproperty-label">Pin Code</label>
                                    <input
                                        type="text"
                                        className="myproperty-location-input"
                                        placeholder="Pin Code"
                                        value={formData.pinCode}
                                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                                        maxLength={6}
                                    />
                                    {formSubmit && !formData.pinCode && <div className="myproperty-location-error">Pin Code is required</div>}
                                    {formSubmit && formData.pinCode && !PINCODE_PATTERN.test(formData.pinCode) && <div className="myproperty-location-error">Pin Code must be a valid 6-digit number</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={propertyDetailsRef} className='row myproperty-section'>
                        <div className="myproperty-section-title-minimal">Property Details</div>
                      
                            {/* Plot & Road Details */}
                            <div className="row">
                                <div className="col-md-4 inside-section-wrapper" >
                                    <label className="myproperty-label">Area Plot Size *</label>
                                    <input
                                        className="myproperty-location-input"
                                        placeholder="Area Plot Size"
                                        value={formData.plotSize || ''}
                                        onChange={e => setFormData({ ...formData, plotSize: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 inside-section-wrapper">
                                    <label className="myproperty-label">Unit</label>
                                    <select
                                        className="myproperty-location-input"
                                        value={formData.plotSizeUnit || 'Marla'}
                                        onChange={e => setFormData({ ...formData, plotSizeUnit: e.target.value })}
                                    >
                                        <option>Marla</option>
                                        <option>Sq. Yards</option>
                                        <option>Sq. Meters</option>
                                        <option>Sq. Feet</option>
                                    </select>
                                </div>
                                <div className="col-md-4 inside-section-wrapper">
                                    <label className="myproperty-label">Facing Road Width</label>
                                    <input
                                        className="myproperty-location-input"
                                        placeholder="Facing road Width"
                                        value={formData.roadWidth || ''}
                                        onChange={e => setFormData({ ...formData, roadWidth: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2 inside-section-wrapper">
                                    <label className="myproperty-label">Unit</label>
                                    <select
                                        className="myproperty-location-input"
                                        value={formData.roadWidthUnit || 'Feet'}
                                        onChange={e => setFormData({ ...formData, roadWidthUnit: e.target.value })}
                                    >
                                        <option>Feet</option>
                                        <option>Meters</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="myproperty-label">Plot Width (in Feet)</label>
                                    <input
                                        className="myproperty-location-input"
                                        placeholder="Plot Width (in Feet)"
                                        value={formData.plotWidth || ''}
                                        onChange={e => setFormData({ ...formData, plotWidth: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Plot Length (in Feet)</label>
                                    <input
                                        className="myproperty-location-input"
                                        placeholder="Plot Length (in Feet)"
                                        value={formData.plotLength || ''}
                                        onChange={e => setFormData({ ...formData, plotLength: e.target.value })}
                                    />
                                </div>
                            </div>
                            {/* Pill Groups */}
                            <div className="row">
                                <div className="col-md-12 inside-section-wrapper">
                                    <label className="myproperty-label">Age of Property (in year)</label>
                                    <div className="myproperty-pill-group">
                                        {['0','0-1','1-3','3-5','5-10','10+'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.age === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, age: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Number of Bedrooms</label>
                                    <div className="myproperty-pill-group">
                                        {['0','1','2','3','4','5+'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.bedrooms === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, bedrooms: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Number of Washrooms</label>
                                    <div className="myproperty-pill-group">
                                        {['0','1','2','3','4','5+'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.washrooms === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, washrooms: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Number of Balconies</label>
                                    <div className="myproperty-pill-group">
                                        {['0','1','2','3','4','5+'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.balconies === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, balconies: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Car Parking</label>
                                    <div className="myproperty-pill-group">
                                        {['0','1','2','3','4','5+'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.parking === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, parking: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-12 inside-section-wrapper">
                                    <label className="myproperty-label">Property Facing</label>
                                    <div className="myproperty-pill-group">
                                        {['North','North-East','East','South-East','South','South-West','West','North-West'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.facing === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, facing: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-12 inside-section-wrapper">
                                    <label className="myproperty-label">Furnishing</label>
                                    <div className="myproperty-pill-group">
                                        {['Fully Furnished','Semi Furnished','Unfurnished'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.furnishing === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, furnishing: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-12 inside-section-wrapper">
                                    <label className="myproperty-label">Possession Available</label>
                                    <div className="myproperty-pill-group">
                                        {['Immediate','0-3 Month','3-6 Month','After 6 Months'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.possession === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, possession: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Number of Floors</label>
                                    <div className="myproperty-pill-group">
                                        {['0','1','2','3','4','5+'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.floors === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, floors: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Number of Open Sides</label>
                                    <div className="myproperty-pill-group">
                                        {['1','2','3','4'].map(val => (
                                            <button
                                                key={val}
                                                className={`myproperty-pill${formData.sides === val ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, sides: val })}
                                                type="button"
                                            >{val}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        
                    </div>

                    <div ref={propertyImagesRef} className='row myproperty-section'>
                        <div className="myproperty-section-title-minimal">Property Images</div>
                        <div className="col-md-12 inside-section-wrapper">
                            
                            <div className="row">
                                <div className="col-md-6 inside-section-wrapper">
                                <label className="myproperty-label">Cover Image <span style={{ color: '#ec161e' }}>*</span></label>
                                    <input
                                        type="file"
                                        className="myproperty-location-input"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFormData({ ...formData, coverImage: e.target.files[0] });
                                            }
                                        }}
                                    />
                                    {formData.coverImage && (
                                        <div style={{marginTop: 8}}>
                                            <img
                                                src={typeof formData.coverImage === 'string' ? formData.coverImage : URL.createObjectURL(formData.coverImage)}
                                                alt="cover"
                                                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }}
                                            />
                                            <button type="button" className="myproperty-image-remove-btn" onClick={() => setFormData({ ...formData, coverImage: null })}>&times;</button>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 inside-section-wrapper">
                                    <label className="myproperty-label">Other Images</label>
                                    <input
                                        type="file"
                                        className="myproperty-location-input"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={e => {
                                            if (e.target.files) {
                                                setFormData({ ...formData, otherImages: Array.from(e.target.files) });
                                            }
                                        }}
                                    />
                                    {formData.otherImages && formData.otherImages.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                                            {formData.otherImages.map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <img
                                                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                                        alt={`other-${idx}`}
                                                        style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 6 }}
                                                    />
                                                    <button type="button" className="myproperty-image-remove-btn" onClick={() => setFormData({ ...formData, otherImages: formData.otherImages.filter((_, i) => i !== idx) })}>&times;</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={pricingOthersRef} className='row myproperty-section'>
                        <div className="myproperty-section-title-minimal">Pricing & Others</div>
                        <div className="col-md-12 inside-section-wrapper">
                            <div className="row">
                                <div className="col-md-4 inside-section-wrapper">
                                    <label className="myproperty-label">Ownership</label>
                                    <div className="myproperty-pill-group">
                                        {['Ownership', 'Power of Attorney'].map(opt => (
                                            <button
                                                key={opt}
                                                className={`myproperty-pill${formData.ownership === opt ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, ownership: opt })}
                                                type="button"
                                            >{opt}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-4 inside-section-wrapper">
                                    <label className="myproperty-label">Authority Approved</label>
                                    <div className="myproperty-pill-group">
                                        {['HSVP', 'MC', 'DTP', 'Other'].map(opt => (
                                            <button
                                                key={opt}
                                                className={`myproperty-pill${formData.authority === opt ? ' selected' : ''}`}
                                                onClick={() => setFormData({ ...formData, authority: opt })}
                                                type="button"
                                            >{opt}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-4 inside-section-wrapper">
                                    <label className="myproperty-label">Other Rooms</label>
                                    <div className="myproperty-pill-group">
                                        {['Puja Room', 'Store Room', 'Study Room'].map(opt => (
                                            <button
                                                key={opt}
                                                className={`myproperty-pill${(formData.otherRooms || []).includes(opt) ? ' selected' : ''}`}
                                                onClick={() => {
                                                    const arr = formData.otherRooms || [];
                                                    setFormData({ ...formData, otherRooms: arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt] });
                                                }}
                                                type="button"
                                            >{opt}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-12 inside-section-wrapper">
                                    <label className="myproperty-label">Near By Facilities</label>
                                    <div className="myproperty-pill-group">
                                        {['Schools', 'Hospitals', 'Public Transportation', 'Shops/Malls', 'Restaurants', 'Parks/Green Spaces'].map(opt => (
                                            <button
                                                key={opt}
                                                className={`myproperty-pill${(formData.facilities || []).includes(opt) ? ' selected' : ''}`}
                                                onClick={() => {
                                                    const arr = formData.facilities || [];
                                                    setFormData({ ...formData, facilities: arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt] });
                                                }}
                                                type="button"
                                            >{opt}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-4 inside-section-wrapper">
                                    <label className="myproperty-label">Expected Amount</label>
                                    <input
                                        className="myproperty-location-input"
                                        placeholder="Expected Amount"
                                        value={formData.amount || ''}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value.replace(/[^0-9]/g, '') })}
                                    />
                                </div>
                                <div className="col-md-8 inside-section-wrapper">
                                    <label className="myproperty-label">&nbsp;</label>
                                    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <label style={{ fontWeight: 500 }}>
                                            <input type="checkbox" checked={formData.negotiable || false} onChange={() => setFormData({ ...formData, negotiable: !formData.negotiable })} /> Price Negotiable
                                        </label>
                                        <label style={{ fontWeight: 500 }}>
                                            <input type="checkbox" checked={formData.rented || false} onChange={() => setFormData({ ...formData, rented: !formData.rented })} /> Already on Rented
                                        </label>
                                        <label style={{ fontWeight: 500 }}>
                                            <input type="checkbox" checked={formData.corner || false} onChange={() => setFormData({ ...formData, corner: !formData.corner })} /> Corner Property
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-12 inside-section-wrapper">
                                    <label className="myproperty-label">Property Description</label>
                                    <textarea
                                        className="myproperty-location-input"
                                        style={{ minHeight: 80, resize: 'vertical' }}
                                        placeholder="Property Description"
                                        value={formData.desc || ''}
                                        onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </LoadScript>
        </>
    )
}

export default MyProperty;