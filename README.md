
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### data for testing:
***user:


Nom: Dubois
Prénom: Luc
Numéro téléphone: 07 12 34 56 78
Email: luc.dubois@mail.fr
Password: Azerty1234&


Nom: Lefevre
Prénom: Marie
Numéro téléphone: 07 98 76 54 32
Email: marie.lefevre@mail.fr
Password: Azerty1234&


Nom: Martin
Prénom: Jean
Numéro téléphone: 07 55 44 33 22
Email: jean.martin@mail.fr
Password: Azerty1234&


Nom: Bernard
Prénom: Sophie
Numéro téléphone: 07 11 22 33 44
Email: sophie.bernard@mail.fr
Password: Azerty1234&


Nom: Moreau
Prénom: Pierre
Numéro téléphone: 07 66 77 88 99
Email: pierre.moreau@mail.fr
Password: Azerty1234&

Nom: Laurent
Prénom: Claire
Numéro téléphone: 07 22 33 44 55
Email: claire.laurent@mail.fr
Password: Azerty1234&

Nom: Richard
Prénom: Elise
Numéro téléphone: 07 88 77 66 55
Email: elise.richard@mail.fr
Password: Azerty1234&

Nom: Simon
Prénom: Nathalie
Numéro téléphone: 07 44 55 66 77
Email: nathalie.simon@mail.fr
Password: Azerty1234&


Nom: Durand
Prénom: Thomas
Numéro téléphone: 07 33 22 11 00
Email: thomas.durand@mail.fr
Password: Azerty1234&

Nom: Petit
Prénom: Alexandre
Numéro téléphone: 07 99 88 77 66
Email: alexandre.petit@mail.fr
Password: Azerty1234&

****testing admin cresdential:
admin@fundrisehub.fr
Azerty1234&

****stripe cli listener
stripe login
stripe listen --forward-to localhost:3050/webhook


****potential error:
stripe block by client: disable adblock

#carte test#
Visa	4242424242424242	Any 3 digits	Any future date
Visa (debit)	4000056655665556	Any 3 digits	Any future date
Mastercard	5555555555554444	Any 3 digits	Any future date
Mastercard (2-series)	2223003122003222	Any 3 digits	Any future date
Mastercard (debit)	5200828282828210	Any 3 digits	Any future date
Mastercard (prepaid)	5105105105105100	Any 3 digits	Any future date
American Express	378282246310005	Any 4 digits	Any future date
American Express	371449635398431	Any 4 digits	Any future date
Discover	6011111111111117	Any 3 digits	Any future date
Discover	6011000990139424	Any 3 digits	Any future date
Discover (debit)	6011981111111113	Any 3 digits	Any future date
Diners Club	3056930009020004	Any 3 digits	Any future date
Diners Club (14-digit card)	36227206271667	Any 3 digits	Any future date
BCcard and DinaCard	6555900000604105	Any 3 digits	Any future date
JCB	3566002020360505	Any 3 digits	Any future date
UnionPay	6200000000000005	Any 3 digits	Any future date
UnionPay (debit)	6200000000000047	Any 3 digits	Any future date
UnionPay (19-digit card)	6205500000000000004	Any 3 digits	Any future date

Generic decline	4000000000000002	card_declined	generic_decline
Insufficient funds decline	4000000000009995	card_declined	insufficient_funds
Lost card decline	4000000000009987	card_declined	lost_card
Stolen card decline	4000000000009979	card_declined	stolen_card
Expired card decline	4000000000000069	expired_card	n/a
Incorrect CVC decline	4000000000000127	incorrect_cvc	n/a
Processing error decline	4000000000000119	processing_error	n/a
Incorrect number decline	4242424242424241	incorrect_number	n/a
Exceeding velocity limit decline	4000000000006975	card_declined	card_velocity_exceeded