# EasyAccomod

## Basic features

### Owner

- Register as Owner, must be verified by **Admin**

  - Register Info: Real name, Identifier, Phone No., Address, Email, (Password)
  - After verification, must be verified again if owner wants to edit info

- Create Post

  - Address, Nearby places, Place Type, Price, Area, Shared?, Facilities (Bath, AC, Balcony, Elec/Water)
  - Images (min 3)
  - Contact Info (taken from register info)
  - Available time (with calculated price)

- Edit Post

  - Cannot edit after being verified by admin
  - Edit function available if not yet verified

- Set rented status
- Extend time
- Verification notification
- Post statistics
- Chat with admin

## Route

- Unauthorized:
  - /: Main page
  - /auth: Authorize
  - /places/place-id: Place Page
  - /user/user-id: User Page
- Authorized:
  - /user/user-id/edit: Edit User
  - /places/create: Create Place
  - /places/place-id/edit: Edit Place

## Attributes

- title
- address
- nearby
- roomtype
- price
- pricetype
- period
- area
- shared
- bathroom
- kitchen
- ac
- balcony
- ew
- extras
- time
- timetype
- images

## Unimplemented Stuff

- Account verification (Admin side)
- Place edit, extend permission (Admin side)
- Place status update function (Client side)
- Notification (admin)
- Add to favorite (renter)
- Review, comment (frontend)
- Report (frontend)

