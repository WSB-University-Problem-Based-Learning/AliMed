import React from 'react';
import Card from '../components/Card';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-alimed-blue mb-4">
          Witamy w systemie AliMed
        </h1>
        <p className="text-xl text-gray-600">
          Internetowy System Rejestracji Pacjentów
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card title="Dla Pacjentów">
          <ul className="space-y-2 text-gray-700">
            <li>✓ Zakładanie kont</li>
            <li>✓ Umawianie wizyt online</li>
            <li>✓ Przeglądanie historii medycznej</li>
            <li>✓ Zarządzanie danymi osobowymi</li>
          </ul>
        </Card>

        <Card title="Dla Personelu">
          <ul className="space-y-2 text-gray-700">
            <li>✓ Przeglądanie listy pacjentów</li>
            <li>✓ Potwierdzanie rezerwacji</li>
            <li>✓ Aktualizowanie terminów wizyt</li>
            <li>✓ Zarządzanie grafikiem</li>
          </ul>
        </Card>

        <Card title="Technologia">
          <ul className="space-y-2 text-gray-700">
            <li>✓ Alibaba Cloud ECS</li>
            <li>✓ ApsaraDB for MySQL</li>
            <li>✓ Object Storage Service</li>
            <li>✓ React + TypeScript</li>
          </ul>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-alimed-blue to-alimed-light-blue text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Zespół projektu (Grupa nr 3)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <p>Grzegorz Matusewicz</p>
            <p>Julia Łopata</p>
            <p>Szymon Małota</p>
            <p>Damian Litewka</p>
            <p>Łukasz Antoniewicz</p>
            <p>Aleksander Kutycki</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
